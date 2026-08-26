import { siteConfig } from '../lib/siteConfig';

/**
 * AdSense ad slot placeholder.
 *
 * Behavior:
 *  - siteConfig.ads.enabled === false → renders NOTHING (no CLS, no space reserved)
 *  - siteConfig.ads.enabled === true  → renders <ins> for AdSense to fill
 *
 * When you get AdSense approval:
 *  1. Set siteConfig.ads.enabled = true
 *  2. Set siteConfig.ads.publisherId = 'ca-pub-XXXXXXXXXXXXXXXX'
 *  3. Add the AdSense script tag in app/layout.js <head>
 *  4. Replace slotId defaults with real slot IDs from AdSense dashboard
 *
 * @param {Object} props
 * @param {string} props.slotId — AdSense ad slot ID (from AdSense dashboard)
 * @param {'in-content'|'header'|'sidebar'|'footer'} [props.placement='in-content']
 * @param {string} [props.className]
 */
export default function AdSlot({ slotId, placement = 'in-content', className = '' }) {
    if (!siteConfig.ads.enabled || !siteConfig.ads.publisherId || !slotId) {
        return null;
    }

    const layouts = {
        'in-content': { format: 'auto', responsive: 'true', minHeight: '250px' },
        'header': { format: 'horizontal', responsive: 'true', minHeight: '90px' },
        'sidebar': { format: 'vertical', responsive: 'true', minHeight: '600px' },
        'footer': { format: 'auto', responsive: 'true', minHeight: '250px' },
    };

    const layout = layouts[placement] || layouts['in-content'];

    return (
        <div
            className={`ad-slot my-6 text-center ${className}`}
            data-placement={placement}
        >
            <p className="text-xs text-ink-faint uppercase tracking-wider mb-1 m-0">
                Advertisement
            </p>
            <ins
                className="adsbygoogle block"
                style={{ display: 'block', minHeight: layout.minHeight }}
                data-ad-client={siteConfig.ads.publisherId}
                data-ad-slot={slotId}
                data-ad-format={layout.format}
                data-full-width-responsive={layout.responsive}
            />
        </div>
    );
}