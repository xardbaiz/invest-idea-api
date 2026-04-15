import {Repository} from "./repository.js";
import {SupabaseIdeaRepository} from "./supabase.repository.js";
import {SqlLiteIdeaRepository} from "./sqlite.repository.js";

export function createRepository(): Repository {
    let repo: Repository;
    const supabaseUrl = process.env.SUPABASE_PUBLIC_URL;
    const supabaseKey = process.env.SUPABASE_PUBLIC_PUBLISHABLE_KEY;
    if (supabaseUrl && supabaseKey) {
        repo = new SupabaseIdeaRepository(supabaseUrl, supabaseKey)
    } else {
        repo = new SqlLiteIdeaRepository();
    }

    return repo;
}