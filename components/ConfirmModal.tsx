'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Info, HelpCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yakin',
  cancelText = 'Batal',
  type = 'warning'
}: ConfirmModalProps) {
  // Prevent body scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine styles and icon based on the confirmation type
  let accentColor = 'var(--color-carolina-blue)';
  let shadowColor = 'var(--color-white)';
  let Icon = HelpCircle;

  if (type === 'danger') {
    accentColor = '#ef4444'; // Red
    shadowColor = '#ef4444';
    Icon = AlertTriangle;
  } else if (type === 'warning') {
    accentColor = '#f59e0b'; // Amber/Yellow
    shadowColor = '#f59e0b';
    Icon = AlertTriangle;
  } else if (type === 'success') {
    accentColor = 'var(--color-pistachio)';
    shadowColor = 'var(--color-pistachio)';
    Icon = Info;
  } else if (type === 'info') {
    accentColor = 'var(--color-carolina-blue)';
    shadowColor = 'var(--color-carolina-blue)';
    Icon = Info;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 11, 20, 0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-card-dark)',
          border: `1.5px solid ${accentColor}`,
          borderRadius: 'var(--radius-md)',
          width: '100%',
          maxWidth: 440,
          padding: 28,
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), 0 0 25px ${accentColor}30`,
          position: 'relative',
        }}
        className="confirm-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            padding: 4,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)')}
        >
          <X size={20} />
        </button>

        {/* Modal Content layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Section */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                background: `${accentColor}15`,
                border: `1.5px solid ${accentColor}`,
                borderRadius: '50%',
                padding: 10,
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 10px ${accentColor}30`,
              }}
            >
              <Icon size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 900,
                  margin: 0,
                  color: 'var(--color-white)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h3>
            </div>
          </div>

          {/* Description Section */}
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: 'rgba(245, 243, 218, 0.75)',
              fontWeight: 400,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message}
          </div>

          {/* Action Buttons Footer */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end',
              marginTop: 8,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              {cancelText}
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                background: accentColor,
                border: 'none',
                color: 'var(--color-bg-dark)',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: `0 0 12px ${accentColor}40`,
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.15)';
                e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}70`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.boxShadow = `0 0 12px ${accentColor}40`;
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .confirm-modal-box {
          animation: popModal 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popModal {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px) rotate(-1deg);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(-0.5deg);
          }
        }
      `}</style>
    </div>
  );
}
