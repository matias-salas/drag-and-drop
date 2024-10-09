import React, { useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { Image, ImagePlus } from 'lucide-react';

interface DraggableImageProps {
  src: string;
  id: string;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ src, id }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-move">
      <Image src={src} alt={`Draggable ${id}`} className="w-16 h-16 object-cover" />
    </div>
  );
};

interface PlacedImage {
  id: string;
  src: string;
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const backgroundImage = 'https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';

  const draggableImages = [
    { id: 'image1', src: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80' },
    { id: 'image2', src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80' },
    { id: 'image3', src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id === 'canvas') {
      const image = draggableImages.find((img) => img.id === active.id);
      if (image) {
        const { x, y } = over.rect;
        setPlacedImages([...placedImages, { ...image, x, y }]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Drag and Drop Canvas App</h1>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white p-4 border-r border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Draggable Images</h2>
          <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-2 gap-4">
              {draggableImages.map((image) => (
                <DraggableImage key={image.id} {...image} />
              ))}
            </div>
          </DndContext>
        </aside>
        <main className="flex-1 p-4">
          <Stage width={800} height={600}>
            <Layer>
              <KonvaImage
                image={new window.Image()}
                src={backgroundImage}
                width={800}
                height={600}
              />
              {placedImages.map((image, index) => (
                <KonvaImage
                  key={`${image.id}-${index}`}
                  image={new window.Image()}
                  src={image.src}
                  x={image.x}
                  y={image.y}
                  width={64}
                  height={64}
                  draggable
                  onDragEnd={(e) => {
                    const updatedImages = [...placedImages];
                    updatedImages[index] = {
                      ...updatedImages[index],
                      x: e.target.x(),
                      y: e.target.y(),
                    };
                    setPlacedImages(updatedImages);
                  }}
                  onClick={() => setSelectedImage(image.id)}
                />
              ))}
            </Layer>
          </Stage>
        </main>
        <aside className="w-64 bg-white p-4 border-l border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Image Properties</h2>
          {selectedImage ? (
            <div>
              <p>Selected Image: {selectedImage}</p>
              {/* Add more properties here */}
            </div>
          ) : (
            <p>No image selected</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default App;