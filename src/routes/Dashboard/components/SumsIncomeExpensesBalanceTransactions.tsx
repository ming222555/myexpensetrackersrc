import './SumsIncomeExpensesBalanceTransactions.scss';

export default function SumsIncomeExpensesBalanceTransactions({
  sumIncomes,
  sumExpenses,
  sumBalance,
  sumTransactions,
  errorSumIncomes,
  errorSumBalance,
  errorSumTransactions,
}: {
  sumIncomes: number | undefined;
  sumExpenses: number | undefined;
  sumBalance: number | undefined;
  sumTransactions: number | undefined;
  errorSumIncomes: Error | null;
  errorSumBalance: Error | null;
  errorSumTransactions: Error | null;
}): JSX.Element {
  return (
    <div className='row Sums__sums'>
      <div className='col-6 col-mg-3 Sums__sum'>
        <p className='Sums__sum-details text-center bg-white m-2'>
          <span className='Sums__sum-amount text-danger d-block py-2'>
            {sumIncomes === undefined ? (
              errorSumIncomes ? (
                <i className='text-red'>{errorSumIncomes.message}</i>
              ) : (
                <i className='text-info'>loading...</i>
              )
            ) : (
              new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sumIncomes)
            )}
          </span>
          <span className='Sums__sum-label d-block pb-2'>Income</span>
        </p>
      </div>
      <div className='col-6 col-mg-3 Sums__sum'>
        <p className='Sums__sum-details text-center bg-white m-2'>
          <span className='Sums__sum-amount text-danger d-block py-2'>
            {sumExpenses === undefined ? '?' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sumExpenses)}
          </span>
          <span className='Sums__sum-label d-block pb-2'>Expenses</span>
        </p>
      </div>
      <div className='col-6 col-mg-3 Sums__sum'>
        <p className='Sums__sum-details text-center bg-white m-2'>
          <span className='Sums__sum-amount text-danger d-block py-2'>
            {sumBalance === undefined ? (
              errorSumBalance ? (
                <i className='text-red'>{errorSumBalance.message}</i>
              ) : (
                <i className='text-info'>loading...</i>
              )
            ) : (
              new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sumBalance)
            )}
          </span>
          <span className='Sums__sum-label d-block pb-2'>Balance</span>
        </p>
      </div>
      <div className='col-6 col-mg-3 Sums__sum'>
        <p className='Sums__sum-details text-center bg-white m-2'>
          <span className='Sums__sum-amount text-info d-block py-2'>
            {sumTransactions === undefined ? (
              errorSumTransactions ? (
                <i className='text-red'>{errorSumTransactions.message}</i>
              ) : (
                <i className='text-info'>loading...</i>
              )
            ) : (
              sumTransactions
            )}
          </span>
          <span className='Sums__sum-label d-block pb-2'>Transactions</span>
        </p>
      </div>
    </div>
  );
}
