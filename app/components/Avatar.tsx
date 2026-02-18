"use client";

// DiceBear avatar utility — generates consistent illustrated profile photos
// Uses the "notionists" style: clean, professional, diverse faces

export function avatarUrl(name: string, size = 80): string {
  const seed = encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&size=${size}&backgroundColor=6366f1,8b5cf6,0ea5e9,10b981,f59e0b,ef4444`;
}

interface AvatarProps {
  name: string;
  size?: number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Avatar({ name, size = 40, borderRadius = "50%", style }: AvatarProps) {
  return (
    <img
      src={avatarUrl(name, size * 2)}
      alt={name}
      width={size}
      height={size}
      style={{
        borderRadius,
        objectFit: "cover",
        display: "block",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
