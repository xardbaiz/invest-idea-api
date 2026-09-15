import { h } from 'preact';
import { Header } from './Header.js';
import { SearchForm } from './SearchForm.js';
import { IdeasTable } from './IdeasTable.js';
import { IdeaItem } from './IdeaRow.js';

interface AppProps {
    query?: string;
    from?: string;
    to?: string;
    limit?: number;
    ideas?: IdeaItem[];
    searched?: boolean;
}

export function App({ query, from, to, limit, ideas = [], searched = false }: AppProps) {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', fontFamily: 'Roboto, Arial, sans-serif' }}>
            <Header />
            <SearchForm query={query} from={from} to={to} limit={limit} />
            <IdeasTable ideas={ideas} searched={searched} />
        </div>
    );
}
