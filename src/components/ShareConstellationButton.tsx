import { motion } from 'motion/react';
import { Share2, Download, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { useChart } from '../contexts/ChartContext';
import { CelestialButton } from './ui/CelestialButton';
import ConstellationArtifactRenderer from './ConstellationArtifactRenderer';

interface ShareConstellationButtonProps {
  onCaptureconstellation: () => Promise<string | null>;
  constellationData?: {
    planets: string[];
    aspects: any[];
    planetPositions: Record<string, [number, number, number]>;
  };
}

export default function ShareConstellationButton({ onCaptureconstellation, constellationData }: ShareConstellationButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [renderArtifact, setRenderArtifact] = useState(false);
  const { subject } = useChart();

  const generateShareableLink = () => {
    if (!subject) {
      console.log('❌ Cannot generate share link: no subject data');
      return null;
    }
    
    console.log('🔗 Generating shareable link with subject:', subject);
    
    // Encode birth data in URL
    const params = new URLSearchParams({
      name: subject.name,
      year: subject.year.toString(),
      month: subject.month.toString(),
      day: subject.day.toString(),
      hour: subject.hour.toString(),
      minute: subject.minute.toString(),
      city: subject.city,
      nation: subject.nation,
      lat: subject.latitude.toString(),
      lon: subject.longitude.toString(),
      tz: subject.timezone,
    });
    
    const link = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    console.log('✅ Generated share link:', link);
    return link;
  };

  const handleCopyLink = async () => {
    const link = generateShareableLink();
    if (!link) return;
    
    console.log('📋 Attempting to copy link to clipboard...');
    
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
        console.log('✅ Link copied successfully using Clipboard API');
        setLinkCopied(true);
        setTimeout(() => {
          setLinkCopied(false);
          setShowShareMenu(false);
        }, 2000);
      } else {
        // Fallback for browsers that don't support Clipboard API
        console.log('⚠️ Clipboard API not available, using fallback');
        copyToClipboardFallback(link);
      }
    } catch (err) {
      // If Clipboard API fails, use fallback method
      console.log('⚠️ Clipboard API failed, using fallback method:', err);
      copyToClipboardFallback(link);
    }
  };

  // Fallback method for copying text
  const copyToClipboardFallback = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      // Show the link in an alert as last resort
      alert(`Copy this link to share:\n\n${text}`);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleDownload = async () => {
    // Chart data is fetched directly by ConstellationArtifactRenderer from ChartContext
    setIsSharing(true);
    setRenderArtifact(true); // Trigger artifact rendering
  };

  const handleArtifactRenderComplete = async (canvas: HTMLCanvasElement) => {
    try {
      // Wait one more frame to ensure render is complete
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Create download from the artifact canvas
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          setIsSharing(false);
          setRenderArtifact(false);
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().split('T')[0];
        const chartName = subject?.name.replace(/\s+/g, '-').toLowerCase() || 'chart';
        link.download = `${chartName}-constellation-${timestamp}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setIsSharing(false);
        setRenderArtifact(false);
        setShowShareMenu(false);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error downloading constellation artifact:', error);
      setIsSharing(false);
      setRenderArtifact(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Share Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onClick={() => setShowShareMenu(!showShareMenu)}
        disabled={isSharing}
        className="fixed bottom-8 left-8 z-40 w-14 h-14 flex items-center justify-center rounded-full backdrop-blur-xl border-2 text-white/80 hover:text-white transition-all pointer-events-auto group disabled:opacity-50"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.2))',
          borderColor: 'rgba(168, 85, 247, 0.5)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSharing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Share2 className="w-6 h-6" />
          </motion.div>
        ) : (
          <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </motion.button>

      {/* Share Menu */}
      {showShareMenu && !isSharing && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-28 left-8 z-40 flex flex-col gap-3 pointer-events-auto"
        >
          {/* Download Image */}
          <CelestialButton
            onClick={handleDownload}
            variant="primary"
            size="md"
            icon={Download}
            iconPosition="left"
          >
            Download Image
          </CelestialButton>

          {/* Copy Shareable Link */}
          <CelestialButton
            onClick={handleCopyLink}
            variant="primary"
            size="md"
            icon={linkCopied ? Check : Link2}
            iconPosition="left"
          >
            {linkCopied ? 'Link Copied!' : 'Copy Share Link'}
          </CelestialButton>

          {/* Hint text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-5 py-2 text-center text-xs text-purple-300/80"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Share your unique constellation with friends! 🌟
          </motion.div>
        </motion.div>
      )}

      {/* Artifact Renderer - only when downloading */}
      {renderArtifact && (
        <ConstellationArtifactRenderer
          onRenderComplete={handleArtifactRenderComplete}
        />
      )}
    </div>
  );
}