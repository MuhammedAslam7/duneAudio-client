
import { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function ImageCropModal({ isOpen, onClose, imageUrl, onCropComplete }) {
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
  const imageRef = useRef(null);

  const onImageLoad = useCallback((img) => {
    imageRef.current = img;
  }, []);

  const handleCrop = useCallback(() => {
    if (imageRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imageRef.current,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedImageUrl = URL.createObjectURL(blob);
              onCropComplete(croppedImageUrl);
              onClose();
            }
          },
          "image/jpeg",
          1
        );
      }
    }
  }, [crop, onCropComplete, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCrop(c)}
          >
            <img
              src={imageUrl}
              onLoad={(e) => onImageLoad(e.target)}
              alt="Crop me"
              className="max-w-full h-auto"
            />
          </ReactCrop>
        </div>
        <DialogFooter className="p-4 pt-0">
          <Button
            variant="outline"
            onClick={() => setCrop({ unit: "%", width: 30, aspect: 16 / 9 })}
          >
            Reset
          </Button>
          <Button onClick={handleCrop}>Apply Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
