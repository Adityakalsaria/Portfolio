# Style images for the portrait reveal

The reveal cycles restyled versions of the *same* photo and melts back to the
real one. Drop these three beside this file, all matching `/public/portrait.webp`
in pose, framing and square crop:

    lego.webp        "make me a lego"
    minecraft.webp   "make me a minecraft"
    roblox.webp      "make me a roblox"

Feed `portrait.webp` to an image model with those prompts, then export each at
about 1024x1024. Any file that is missing falls back to the real photo, so the
card still renders — it just has nothing to cycle to.
