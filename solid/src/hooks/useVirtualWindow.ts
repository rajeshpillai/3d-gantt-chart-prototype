import { createSignal, createEffect, type Accessor } from 'solid-js';

export interface VirtualWindow {
    start: number;
    end: number;
}

export function useVirtualWindow(totalItems: Accessor<number>): Accessor<VirtualWindow> {
    const [renderRange, setRenderRange] = createSignal<VirtualWindow>({ start: 0, end: 100 });

    createEffect(() => {
        const total = totalItems();
        // For now, render all items (we can add virtualization later)
        setRenderRange({ start: 0, end: Math.min(total, 100) });
    });

    return renderRange;
}
