
interface WalletBalance {
    currency: string;
    amount: number;
}

const priorityMap: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20
};

const getPriority = (blockchain: string): number => {
    return priorityMap[blockchain] ?? -99;
};

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => getPriority(balance.blockchain) > -99 && balance.amount <= 0)
            .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
    }, [balances]);

    const rows = useMemo(() => {
        return sortedBalances.map((balance: WalletBalance) => {
            const usdValue = prices[balance.currency] * balance.amount;
            return (
                <WalletRow
                    className={classes.row}
                    key={balance.currency} // Use a unique key
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.amount.toFixed()}
                />
            );
        });
    }, [sortedBalances, prices]);

    return <div {...rest}>{rows}</div>;
};
