import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allIncomes = await this.find({
      where: { type: 'income' },
    });

    const allOutcomes = await this.find({
      where: { type: 'outcome' },
    });

    const sumOfIncomes = allIncomes.reduce(
      (previousTransaction, currentTransaction) => {
        return previousTransaction + currentTransaction.value;
      },
      0,
    );

    const sumOfOutcomes = allOutcomes.reduce(
      (previousTransaction, currentTransaction) => {
        return previousTransaction + currentTransaction.value;
      },
      0,
    );

    return {
      income: sumOfIncomes,
      outcome: sumOfOutcomes,
      total: sumOfIncomes - sumOfOutcomes,
    };
  }
}

export default TransactionsRepository;
