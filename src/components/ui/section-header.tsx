interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-3xl font-bold text-gray-900">{title}</h2>
      <div className="mx-auto mt-2 h-0.5 w-16 bg-rose-300" />
      {subtitle && <p className="mt-4 text-gray-600">{subtitle}</p>}
    </div>
  );
}