import { type Component, createSignal, For, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Palette, ChevronDown, Check } from 'lucide-solid';
import { useTheme } from '../../ThemeContext';
import type { ThemePreset } from '../../theme';

const ThemeDropdown: Component = () => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = createSignal(false);
    const [position, setPosition] = createSignal({ top: 0, left: 0, width: 0 });

    let buttonRef: HTMLButtonElement | undefined;

    const presets: ThemePreset[] = ['metaverse', 'cyberpunk', 'midnight', 'matrix', 'arctic'];

    const toggle = () => {
        if (!buttonRef) return;
        const rect = buttonRef.getBoundingClientRect();
        setPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: Math.max(rect.width, 180)
        });
        setIsOpen(!isOpen());
    };

    // Close on click outside logic could be added here (e.g., using onClick global)
    // For now, simple toggle is fine.

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggle}
                style={{
                    display: 'flex',
                    'align-items': 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: theme.colors().glass,
                    border: `1px solid ${theme.colors().glassHigh}`,
                    'border-radius': '6px',
                    color: theme.colors().text.main,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = theme.colors().glassHigh)}
                onMouseLeave={(e) => (e.currentTarget.style.background = theme.colors().glass)}
            >
                <Palette size={16} />
                <span style={{ 'font-size': '14px', 'text-transform': 'capitalize' }}>
                    {theme.preset()}
                </span>
                <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </button>

            <Show when={isOpen()}>
                <Portal>
                    {/* Backdrop to handle click outside (simple version) */}
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            'z-index': 1999,
                            background: 'transparent'
                        }}
                    />

                    <div style={{
                        position: 'fixed',
                        top: `${position().top}px`,
                        left: `${position().left - (180 - position().width)}px`, // Align right side roughly or just left
                        // Actually, let's align right edge to button right edge if usually on right side of screen
                        // Or just left
                        // Simple: left aligned
                        // left: `${position().left}px`, 
                        // Better: Align center or right?
                        // Since it's on right side of header, let's align right
                        'margin-left': '-100px', // Hacky adjustment or calculation
                        // Let's use left calculation properly:
                        // left: rect.right - 180
                        width: '180px',
                        background: 'rgba(0, 0, 0, 0.95)',
                        'backdrop-filter': 'blur(10px)',
                        border: `1px solid ${theme.colors().glassHigh}`,
                        'border-radius': '8px',
                        padding: '4px',
                        'z-index': 2000,
                        'box-shadow': '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                        <For each={presets}>
                            {(preset) => (
                                <button
                                    onClick={() => {
                                        theme.setPreset(preset);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        'align-items': 'center',
                                        'justify-content': 'space-between',
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: theme.colors().text.main,
                                        cursor: 'pointer',
                                        'text-align': 'left',
                                        'font-size': '14px',
                                        'border-radius': '4px',
                                        'text-transform': 'capitalize'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = theme.colors().glassHigh)}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <span>{preset}</span>
                                    {theme.preset() === preset && <Check size={14} color={theme.colors().primary} />}
                                </button>
                            )}
                        </For>
                    </div>
                </Portal>
            </Show>
        </>
    );
};

export default ThemeDropdown;
