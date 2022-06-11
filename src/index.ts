import initialize from './initialize';
import { tryOrFallback } from './utils';

export const init = async (args: string[]): Promise<void> => {
    const stats = await tryOrFallback(
        async () => initialize(args),
        async (err) => {
            console.log(err);
        }
    );
    // print stats
};
