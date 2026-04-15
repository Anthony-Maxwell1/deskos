import { NextResponse } from 'next/server';
import { JSONFilePreset } from 'lowdb/node';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');
const defaultData = { configs: {} };
const db = await JSONFilePreset('db.json', defaultData)

export async function GET() {
  try {
    await db.read();
    
    const configs = db.data?.configs || {};
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(configs)) {
      if (value && typeof value === 'object' && 'name' in value) {
        result[key] = (value as Record<string, string>).name;
      }
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read configs' }, { status: 500 });
  }
}