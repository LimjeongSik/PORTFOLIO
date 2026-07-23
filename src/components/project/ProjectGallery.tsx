import { Reveal } from "@/components/ui/Reveal";

interface ProjectGalleryProps {
    images: string[];
    title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
    return (
        <div className="mt-10 space-y-6">
            {images.map((src, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: 갤러리 이미지는 순서가 고정된 정적 목록이라 인덱스 키가 안전
                <Reveal key={`${title}-gallery-${index}`}>
                    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                        <img
                            src={src}
                            alt={`${title} 화면 ${index + 1}`}
                            className="w-full object-cover"
                        />
                    </div>
                </Reveal>
            ))}
        </div>
    );
}
