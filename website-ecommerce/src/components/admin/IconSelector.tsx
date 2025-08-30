"use client";
import { Icon } from "@/types";

export function IconSelector({ icons, selected, onChange }: {
    icons: Icon[];
    selected: number[]; 
    onChange: (ids: number[]) => void;}) {

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {icons.map(icon => {
                const checked = selected.includes(icon.id);
                return (
                    <label key={icon.id} className="flex items-center gap-2">
                        <input
                            type="checkbox" checked={checked}
                            onChange={(e) => { onChange(
                                e.target.checked
                                ? [...selected, icon.id]
                                : selected.filter(id => id !== icon.id)
                                );
                            }}
                        />
                        <img src={icon.url} alt={icon.name} className="w-6 h-6 object-contain" />
                        <span>{icon.name}</span>
                    </label>
                );
            })}
        </div>
    );
};