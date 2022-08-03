/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation, query } from '@/graphql';
import { ICreateDebtInput, IDebt, IDeleteDebtInput } from '@/types';
import { API } from 'aws-amplify';
import { removeProperties } from '@/util';

export async function createDebt(payload: ICreateDebtInput) {
  const { data } = await API.graphql({
    query: mutation.createDebt,
    variables: { input: payload },
  }) as any;

  return data.createDebt;
}

export async function deleteDebt(payload: IDeleteDebtInput) {
  const { data } = await API.graphql({
    query: mutation.deleteDebt,
    variables: { input: payload },
  }) as any;

  return data.deleteDebt;
}

export async function fetchDebt() {
  const fetchDebtResponse = await API.graphql({
    query: query.listDebts,
  });

  return fetchDebtResponse;
}

export async function updateDebt(payload: IDebt, extraFieldsToRemove?: string[]) {
  const propertiesToRemove = ['owner', 'createdAt', 'updatedAt', '_deleted', '_lastChangedAt', 'user'];

  if (extraFieldsToRemove) {
    propertiesToRemove.concat(extraFieldsToRemove);
  }

  const updatePayload = removeProperties(payload, propertiesToRemove);

  const { data } = await API.graphql({
    query: mutation.updateDebt,
    variables: { input: updatePayload },
  }) as any;

  return data.updateDebt;
}