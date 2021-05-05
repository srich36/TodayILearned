## General

- A *codec* is something that encodes and decodes a video (it literally means coder-decoder)
    - H.264 (aka AVC - advanced video encoding) is the most popular video codec (encoding and decoding algorithm)
    - AAC is the most popular for audio
    - Codecs use *lossy compression* (irreversible compression since data is lost) where unnecessary data is thrown away
- A *bitrate* refers to the number of bits that are processed over a given unit of time
    - Higher bitrates = higher quality

## Encoders

- An encoder is just an algorithm that takes in an input video and processes it
- This compresses the video greatly (e.g. from gigabytes to megabytes)

### Software Encoders

- Pieces of software that capture data from video cards and encode it in a format to be transferred over the internet
- Rely on the system cpu to run the encoding algorithm
- Higher latency (with slower encoders)

### Hardware Encoders

- Specialized hardware that can connect straight to the camera and run encoding algorithms to produce and encoded video
- Come pre-built with the encoding algorithm and the processing unit to run it
- Much more expensive

## Live Streaming

- To start a live stream you need to encode the video you are capturing and send it to a video ingest server for processing
    - Often this ingest format is `RTMP` (Real-time messaging protocol) but now sometimes `HLS` is used (HTTP Live Streaming)
    - Programs to do this encoding for you: OBS Studio, 
- Products like `mux` video make live streaming much easier to work with with APIs
  - Also provide video archives, etc.
- Apple's `HLS` is much more widely used as a video playback format now
- Generally the flow is as follows:
  - Some client sends an RTMP stream to a live stream server
  - The live stream server transcodes this into different bitrates
  - For each bitrate seconds of 1-10 seconds length are produced
  - An ABR algorithm on the client requests the segments for the player
  - These segments are downloaded over HTTP with something like `HLS` or `MPEG-Dash`

### Live Streaming From Browser

- Browsers don't support RTMP encoding, yet ingest servers often only speak RTMP
  - Thus, we need to convert WebRTC to RTMP server-side (flashphoner?)
  - Next, we can redirect this stream to the RTMP ingest
- Sample architecture: browser WebRTC -> flashphoner WCS (convert WebRTC to RTMP) -> Mux video -> HLS to
browser in HLS player

## Transcoding

- *Transcoding* is the process of taking an encoded video stream, decoding it (decompressing), then
altering and recompressing it
- e.g. Transcoding an MPEG2 source to H.264 video and AAC audio
- *Transrating* is the process of taking a stream and converting it to a different *bitrate*
- **Video conversion is computationally expensive**

### Transcoding Use Cases

- Transcoding is extremely important to reach a variety of users
- e.g. you use an RTMP encoder at 1080P using the H.264 codec. When trying to stream this to viewers, those without
sufficient bandwidth will be unable to see the stream (will be buffering constantly)
- With transcoding you simultaneously create a set of time-aligned video streams, each with a different bit-rate and
frame sizes
  - This can then be packaged into different *adaptive streaming* formats (e.g. HLS) for playback on any client

## Adaptive Streaming

- *Adaptive bitrate streaming* (ABR) is used to provide the best video quality and experience to viewers no matter
the connection, software, or device
- Streams adapt to fit the screen size and internet speed of all who are watching
- A transcoder is used to create multiple streams at different bitrates and resolutions (uses transrating and transizing)
- The media server then sends the highest quality stream for the user's bandwidth
- The transcoder breaks each stream into chunks 2-10 seconds in length, allowing the player to shift dynamically between
the streams depending on bandwidth
- **Since this limits the bandwidth required to deliver streams it reduces distribution cost**
- Before ABR RTMP was used to deliver streams. You can configure RTMP streams for ABR but it is hard
- First, the client downloads a manifest file describing available segments of the stream and their corresponding birates
- An ABR algorithm on the client builds up to and then stabilizes at the optimal bitrate
    - When the bitrate is selected, the client downloads the segments of that bitrate in the 2-10 second chunks, switching
    up if the available resources change

## Video Format

- Once a video is encoded, it is stored in a wrapper file format with associated codec (used to encode and to be used
to decode, audio codec, closed captions, and associated metadata)
    - e.g. `.mp4`, `.mov`, `.wmv`
- Not all playback platforms accept all containers and codecs, **this is why multi-format encoding is crucial**

