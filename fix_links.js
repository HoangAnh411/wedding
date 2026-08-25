const fs = require('fs');

const files = [
  'dashboard/dashboard-client.tsx',
  'payments/payments-client.tsx',
  'settings/settings-client.tsx',
  'staff/staff-client.tsx',
  'vendors/vendors-client.tsx'
];

for (let file of files) {
  let p = 'd:/Data/weddingProject/src/app/[lang]/admin/' + file;
  let c = fs.readFileSync(p, 'utf-8');
  
  let modified = false;

  if (c.includes('next/link') || c.includes('next/navigation')) {
    if (!c.includes('usePathname')) {
      if (c.includes('next/navigation')) {
        c = c.replace(/import \{([^}]*)\} from "next\/navigation";/, 'import { $1, usePathname } from "next/navigation";');
      } else {
        c = c.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { usePathname } from "next/navigation";');
      }
      modified = true;
    }

    if (!c.includes('const lang = pathname.split')) {
      c = c.replace(/const dict = useTranslation\(\);/, 'const dict = useTranslation();\n  const pathname = usePathname();\n  const lang = pathname.split("/")[1];');
      modified = true;
    }

    // Replace <Link href="/admin
    if (c.includes('href="/admin')) {
      c = c.replace(/href="\/admin([^"]*)"/g, 'href={`/${lang}/admin$1`}');
      modified = true;
    }
    
    if (c.includes('href={`/admin')) {
      c = c.replace(/href=\{\`\/admin/g, 'href={`/${lang}/admin');
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(p, c);
    console.log('Fixed links in ' + file);
  }
}
