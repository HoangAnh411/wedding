const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Data/weddingProject/src/app/api';
const modelsMap = {
    'budget': 'budgetItem',
    'checkin': 'checkIn', // wait, checkin is checkIn model! Let's check checkin/route.ts POST
    'checklist': 'checklistItem',
    'gallery': 'galleryImage',
    'guests': 'guest',
    'money-gifts': 'moneyGift',
    'music': 'musicTrack',
    'tables': 'table',
    'vendors': 'vendor'
};

function fixIdRoute(filepath, modelName) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf-8');

    if (!content.includes('apiError')) {
        content = content.replace(/apiSuccess( |})/g, 'apiSuccess, apiError$1');
    }

    // Replace async () => or async (req) => with async (req, { userId }) =>
    content = content.replace(/withAuth\(\s*req\s*,\s*async\s*\(\)\s*=>/g, 'withAuth(req, async (req, { userId }) =>');
    content = content.replace(/withAuth\(\s*req\s*,\s*async\s*\(req\)\s*=>/g, 'withAuth(req, async (req, { userId }) =>');

    // For GET in [id] (like guests)
    if (content.includes('findUnique(')) {
        content = content.replace(
            new RegExp(`await prisma\\.${modelName}\\.findUnique\\({\\s*where:\\s*{\\s*id\\s*}\\s*}\\)`, 'g'),
            `await prisma.${modelName}.findFirst({ where: { id, wedding: { userId } } })`
        );
    }
    
    const check = `\n    const existing = await prisma.${modelName}.findFirst({ where: { id, wedding: { userId } } });\n    if (!existing) return apiError('Not found', 404);\n`;

    // For PUT
    content = content.replace(
        new RegExp(`(const \\w+ = await prisma\\.${modelName}\\.update\\({)`),
        check + '$1'
    );

    // For DELETE
    content = content.replace(
        new RegExp(`(await prisma\\.${modelName}\\.delete\\({)`),
        check + '$1'
    );

    fs.writeFileSync(filepath, content, 'utf-8');
    console.log('Fixed', filepath);
}

function fixColRoute(filepath, modelName) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf-8');

    if (!content.includes('apiError')) {
        content = content.replace(/apiSuccess( |})/g, 'apiSuccess, apiError$1');
    }

    // Fix GET
    content = content.replace(
        'where: weddingId ? { weddingId } : { wedding: { userId } }',
        'where: weddingId ? { weddingId, wedding: { userId } } : { wedding: { userId } }'
    );

    // Fix POST
    content = content.replace(/withAuth\(\s*req\s*,\s*async\s*\(\)\s*=>/g, 'withAuth(req, async (req, { userId }) =>');
    content = content.replace(/withAuth\(\s*req\s*,\s*async\s*\(req\)\s*=>/g, 'withAuth(req, async (req, { userId }) =>');

    const check = `\n    const wedding = await prisma.wedding.findFirst({ where: { id: parsed.weddingId, userId } });\n    if (!wedding) return apiError("Not found", 404);\n`;

    content = content.replace(
        new RegExp(`(const \\w+ = await prisma\\.${modelName}\\.create\\({)`),
        check + '$1'
    );

    fs.writeFileSync(filepath, content, 'utf-8');
    console.log('Fixed', filepath);
}

for (const [routeDir, modelName] of Object.entries(modelsMap)) {
    const idRoute = path.join(baseDir, routeDir, '[id]', 'route.ts');
    fixIdRoute(idRoute, modelName);

    const colRoute = path.join(baseDir, routeDir, 'route.ts');
    fixColRoute(colRoute, modelName);
}
