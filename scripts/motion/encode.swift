// Assemble un dossier d'images PNG numérotées en MP4 H.264 (aucun outil externe, juste macOS).
// Usage : swift encode.swift <dossier> <sortie.mp4> <fps>
import AVFoundation
import AppKit

let args = CommandLine.arguments
guard args.count == 4, let fps = Int32(args[3]) else { print("usage: encode.swift dossier sortie.mp4 fps"); exit(1) }
let files = try FileManager.default.contentsOfDirectory(atPath: args[1]).filter { $0.hasSuffix(".png") }.sorted()
guard let first = NSImage(contentsOfFile: args[1] + "/" + files[0]), let cg0 = first.cgImage(forProposedRect: nil, context: nil, hints: nil) else { exit(2) }
let (w, h) = (cg0.width, cg0.height)
let url = URL(fileURLWithPath: args[2])
try? FileManager.default.removeItem(at: url)
let writer = try AVAssetWriter(outputURL: url, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: w, AVVideoHeightKey: h,
    AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 8_000_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel],
])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: w, kCVPixelBufferHeightKey as String: h,
])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)
for (i, f) in files.enumerated() {
    guard let img = NSImage(contentsOfFile: args[1] + "/" + f), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
    while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.005) }
    var buf: CVPixelBuffer?
    CVPixelBufferCreate(nil, w, h, kCVPixelFormatType_32ARGB, nil, &buf)
    guard let pb = buf else { continue }
    CVPixelBufferLockBaseAddress(pb, [])
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb), width: w, height: h, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb),
                        space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))
    CVPixelBufferUnlockBaseAddress(pb, [])
    adaptor.append(pb, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: fps))
}
input.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
print(writer.status == .completed ? "encodé" : "erreur: \(String(describing: writer.error))")
