import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionWithCategory {
  title: string;
  type: string;
  value: number;
  category_id: string;
  category: Category | undefined;
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

  public async listTransactionsWithCategory(): Promise<
    TransactionWithCategory[]
  > {
    const categoriesRepository = getRepository(Category);

    const categories = await categoriesRepository.find();
    const allTransactions = await this.find();

    const finalTransaction = allTransactions.map(transaction => ({
      id: transaction.id,
      title: transaction.title,
      type: transaction.type,
      value: transaction.value,
      category_id: transaction.category_id,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      category: categories.find(
        category => category.id === transaction.category_id,
      ),
    }));

    return finalTransaction;
  }
}

export default TransactionsRepository;
