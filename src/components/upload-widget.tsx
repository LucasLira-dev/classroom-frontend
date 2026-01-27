import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from "@/constants";
import { UploadWidgetValue } from "@/types";
import { UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UploadWidgetProps {
    value: { url: string; publicId: string } | null;
    onChange: (file: any, field: any) => void;
    disabled?: boolean;
}

export default function UploadWidget({ value = null, onChange, disabled = false }: UploadWidgetProps) {

    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onChangeRef = useRef(onChange);
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value)

    const openWidget = () => {
        if (!disabled) widgetRef.current?.open(); // Abre o widget apenas se não estiver desabilitado
    }

    useEffect(() => {
        setPreview(value);
    }, [value]); // Atualiza o preview quando o valor muda, se nao tiver valor, reseta o deleteToken

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]); // Mantém a referência atualizada para a função onChange

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initializeWidget = () => {
            if (!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                multiple: false,
                folder: 'uploads',
                maxFileSize: 5 * 1024 * 1024, // 5MB
                clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
            }, (error, result) => {
                if (!error && result.event === "success") {
                    const payload: UploadWidgetValue = {
                        url: result.info.secure_url,
                        publicId: result.info.public_id,
                    };
                    setPreview(payload);
                    onChangeRef.current?.(payload);
                    }
                });

            return true;
        }

        if (initializeWidget()) return;

        const intervalId = window.setInterval(() => {
            if (initializeWidget()) {
                window.clearInterval(intervalId);
            }
        }, 500); // Tenta inicializar a cada 500ms

        return () => {
            window.clearInterval(intervalId);
        } // Limpa o intervalo na desmontagem
    }, []);

    return (
        <div
        className="space-y-2">
            { preview ? (
                <div className="upload-preview">
                     <img src={preview.url} alt="Uploaded file preview" />
                </div>
            ) : (
                <div className="upload-dropzone" role="button" tabIndex={0} 
                onClick={openWidget} onKeyDown={(event) => {
                    if (event.key === 'Enter'){
                        event.preventDefault();
                        openWidget();
                    }
                }}> 
                    <div className="upload-prompt">
                        <UploadCloud className="icon" />
                        <div>
                            <p> Click to upload </p>
                            <p> PNG, JPG, up to 5MB </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}