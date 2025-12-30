import { type Component, createSignal, For, Show } from 'solid-js';
import { Palette, ChevronDown, Check } from 'lucide-solid';
import { useTheme } from '../../ThemeContext';
import type { ThemePreset } from '../../theme';

const ThemeDropdown: Component = () => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = createSignal(false);

    const presets: ThemePreset[] = ['metaverse', 'cyberpunk', 'midnight', 'matrix', 'arctic'];

    // Close dropdown when clicking outside would be handled by a global listener in a real app
    // For now, simpler toggle

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen())}
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
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    'margin-top': '4px',
                    width: '180px',
                    background: 'rgba(0, 0, 0, 0.9)',
                    'backdrop-filter': 'blur(10px)',
                    border: `1px solid ${theme.colors().glassHigh}`,
                    'border-radius': '8px',
                    padding: '4px',
                    'z-index': 100,
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
            </Show>
        </div>
    );
};

export default ThemeDropdown;
