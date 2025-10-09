import React, { useState } from "react"
import Cropper from "react-easy-crop"
import getCroppedImg from "@/utils/cropImage"
import { Button } from "../ui/button"
import { Slider } from "../ui/slider"
import { Label } from "../ui/label"
import { CropIcon, X } from "lucide-react"
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog"

const zoomPercent = (value) => `${Math.round(value * 100)}%`

const CropEasy = ({ photoURL, open, setOpen, onCropped, aspect = 1 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const cropComplete = (croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)

    const handleCrop = async () => {
        const result = await getCroppedImg(photoURL, croppedAreaPixels, rotation)
        onCropped?.(result)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <div className="relative w-full h-[400px] mt-4">
                    <Cropper
                        image={photoURL}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropChange={setCrop}
                        onCropComplete={cropComplete}
                    />
                </div>
                <DialogFooter className="space-y-4 mt-4 px-4 pb-4">
                    <div className="w-full space-y-4">
                        <div className="space-y-2">
                            <Label>Zoom: {zoomPercent(zoom)}</Label>
                            <Slider value={[zoom]} min={0.5} max={3} step={0.1} onValueChange={(e) => setZoom(e[0])} />
                        </div>
                        <div className="space-y-2">
                            <Label>Rotation: {rotation}°</Label>
                            <Slider value={[rotation]} min={0} max={360} onValueChange={(e) => setRotation(e[0])} />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                <X className="mr-2" /> Cancel
                            </Button>
                            <Button onClick={handleCrop}>
                                <CropIcon className="mr-2" /> Apply
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CropEasy
