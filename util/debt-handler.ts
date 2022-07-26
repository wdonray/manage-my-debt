import { mutation, query } from '@/graphql';
import { ICreateDebtInput, IUpdateDebtInput } from '@/types';
import { API } from 'aws-amplify';


export async function createDebt(payload: ICreateDebtInput) {
  const createDebtResponse = await API.graphql({
    query: mutation.createDebt,
    variables: { input: payload },
  });

  return createDebtResponse;
}

export async function fetchDebt() {
  const fetchDebtResponse = await API.graphql({
    query: query.listDebts,
  });

  return fetchDebtResponse;
}

export async function updateDebt(payload: IUpdateDebtInput) {
  const updateDebtResponse = await API.graphql({
    query: mutation.updateDebt,
    variables: { input: payload },
  });

  return updateDebtResponse;
}