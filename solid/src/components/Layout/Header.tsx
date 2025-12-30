import { type Component, For } from 'solid-js';
import { LayoutGrid, BarChart3, Users, Settings, Activity, Box } from 'lucide-solid';
import { useTheme } from '../../ThemeContext';
import ThemeDropdown from '../UI/ThemeDropdown';

const Header: Component = () => {
    const theme = useTheme();

    const navItems = [
        { label: 'Dashboard', icon: LayoutGrid, active: false },
        { label: 'Gantt', icon: BarChart3, active: true },
        { label: 'Resources', icon: Users, active: false },
        { label: 'Analytics', icon: Activity, active: false },
        { label: 'Settings', icon: Settings, active: false },
    ];

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: theme.colors().glassHigh,
            'backdrop-filter': 'blur(10px)',
            'border-bottom': `1px solid ${theme.colors().glassHigh}`,
            'z-index': 50,
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'space-between',
            padding: '0 24px'
        }}>
            {/* Logo Area */}
            <div style={{ display: 'flex', 'align-items': 'center', gap: '12px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: `linear-gradient(135deg, ${theme.colors().primary}, ${theme.colors().secondary})`,
                    'border-radius': '8px',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'box-shadow': `0 0 10px ${theme.colors().primary}40`
                }}>
                    <Box size={20} color="#fff" />
                </div>
                <div style={{ 'font-weight': 'bold', 'font-size': '18px', 'letter-spacing': '-0.5px' }}>
                    <span style={{ color: theme.colors().text.main }}>Nexus</span>
                    <span style={{ color: theme.colors().primary }}>CRM</span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', gap: '8px' }}>
                <For each={navItems}>
                    {(item) => (
                        <button
                            style={{
                                display: 'flex',
                                'align-items': 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                background: item.active ? theme.colors().glassHigh : 'transparent',
                                border: 'none',
                                'border-radius': '20px',
                                color: item.active ? theme.colors().primary : theme.colors().text.muted,
                                'font-weight': item.active ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                'font-size': '14px'
                            }}
                            onMouseEnter={(e) => {
                                if (!item.active) {
                                    e.currentTarget.style.background = theme.colors().glass;
                                    e.currentTarget.style.color = theme.colors().text.main;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!item.active) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = theme.colors().text.muted;
                                }
                            }}
                        >
                            <item.icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    )}
                </For>
            </nav>

            {/* Right Actions */}
            <div style={{ display: 'flex', 'align-items': 'center', gap: '16px' }}>
                <ThemeDropdown />
                <div style={{
                    width: '32px',
                    height: '32px',
                    'border-radius': '50%',
                    background: theme.colors().glass,
                    border: `1px solid ${theme.colors().glassHigh}`,
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    color: theme.colors().text.main,
                    'font-size': '12px',
                    'font-weight': 'bold'
                }}>
                    JS
                </div>
            </div>
        </header>
    );
};

export default Header;
