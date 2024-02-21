export default function colorLevel(score: string | number) {
    if (typeof score === 'string') {
        score = parseInt(score);
    }

    switch (true) {
        case score < 60: {
            return 'text-red-400';
        }
        case score < 90: {
            return 'text-yellow-400';
        }
        default: {
            return 'text-green-400';
        }
    }
}
