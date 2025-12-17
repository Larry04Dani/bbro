import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const data = await request.json();

        // Paths
        const assetsDir = path.join(process.cwd(), 'src', 'assets', 'Profittabilità');
        const templatePath = path.join(assetsDir, 'Profittabilità.tex');

        // Read template
        let content = fs.readFileSync(templatePath, 'utf8');

        // Helper to escape special LaTeX characters
        const escapeLatex = (str) => {
            if (typeof str !== 'string') return str;
            return str
                .replace(/&/g, '\\&')
                .replace(/%/g, '\\%')
                .replace(/\$/g, '\\$')
                .replace(/#/g, '\\#')
                .replace(/_/g, '\\_')
                .replace(/{/g, '\\{')
                .replace(/}/g, '\\}')
                .replace(/~/g, '\\textasciitilde')
                .replace(/\^/g, '\\textasciicircum');
        };

        // Fields that contain raw LaTeX and should not be escaped
        const rawFields = ['FACILITIES', 'TAGLI'];

        // Replace placeholders
        Object.keys(data).forEach(key => {
            const placeholder = `{{${key}}}`;
            let value = String(data[key] || '');

            if (!rawFields.includes(key)) {
                value = escapeLatex(value);
            }

            content = content.split(placeholder).join(value);
        });

        // Return the populated .tex file
        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': `attachment; filename="Profittabilita_${data.COGNOME || 'Cliente'}.tex"`,
            },
        });

    } catch (error) {
        console.error('Error generating TEX:', error);
        return NextResponse.json({ error: 'Failed to generate TEX file', details: error.message }, { status: 500 });
    }
}
