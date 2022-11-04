import { ChangeEvent, MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DebtCard, UpdateDebtModal } from './components';
import { DebtContext, SearchEnum } from '@/util';

import EmptyList from './components/EmptyList/empty-list';
import FilterDebt from './components/FilterDebt/filter-debt';
import { IDebt } from '@/types';
import { orderBy } from 'lodash';

export enum SortDebt {
  none = 'none',
  balance = 'balance',
  apr = 'apr',
  payment = 'payment',
}

export enum SortDirection {
  none = 'none',
  asc = 'asc',
  desc = 'desc',
}

export enum SearchType {
  name = 'name',
  type = 'type',
}

export default function DebtCards() {
  const { debtList, localDebtList, isUserAuthenticated } = useContext(DebtContext);

  const [searchByValue, setSearchByValue] = useState('');
  const [searchByType, setSearchByType] = useState<SearchType>(SearchType.name);
  const [currentDirection, setCurrentDirection] = useState<SortDirection>(SortDirection.none);
  const [currentSort, setCurrentSortDebt] = useState<SortDebt>(SortDebt.none);

  const [loading, setLoading] = useState(false);

  const handleSearchValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.target;

    setSearchByValue(value.trim());
  }, []);

  const handleSearchType = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { name } = event.target as HTMLButtonElement;

    setSearchByType(SearchEnum(SearchType, name) as SearchType);
  }, []);

  const handleSortSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setCurrentSortDebt(SearchEnum(SortDebt, value) as SortDebt);
  }, []);

  const handleSortDirection = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      setCurrentDirection(currentDirection === SortDirection.asc ? SortDirection.desc : SortDirection.asc);
    },
    [currentDirection]
  );

  const rawDebtList = useMemo(() => {
    return isUserAuthenticated ? debtList : localDebtList;
  }, [debtList, isUserAuthenticated, localDebtList]);

  const currentDebtList = useMemo(() => {
    setLoading(true);

    let list = rawDebtList;

    if (searchByValue != '') {
      list = list?.filter((item) => {
        return item[searchByType].toLocaleLowerCase().includes(searchByValue.toLocaleLowerCase());
      });
    }

    if (currentDirection != SortDirection.none) {
      list = orderBy(list, [currentSort], [currentDirection]);
    }

    setLoading(false);

    return list;
  }, [currentDirection, currentSort, rawDebtList, searchByType, searchByValue]);

  const isListEmpty = useMemo(() => {
    return !currentDebtList || !currentDebtList.length;
  }, [currentDebtList]);

  const direction = useMemo(() => {
    return currentDirection === SortDirection.asc ? 'ascending' : 'descending';
  }, [currentDirection]);

  useEffect(() => {
    if (currentSort != SortDebt.none && currentDirection == SortDirection.none) {
      setCurrentDirection(SortDirection.asc);
    } else if (currentSort == SortDebt.none) {
      setCurrentDirection(SortDirection.none);
    }
  }, [currentDirection, currentSort]);

  if (loading) {
    return (
      <div className='d-flex justify-content-center'>
        <div
          className='spinner-border text-info m-5 p-3'
          role='status'
        >
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UpdateDebtModal />
      <EmptyList isListEmpty={isListEmpty} />
      {rawDebtList && rawDebtList.length > 0 && (
        <FilterDebt
          searchByType={searchByType}
          searchByValue={searchByValue}
          currentSort={currentSort}
          currentDirection={currentDirection}
          handleSearchType={handleSearchType}
          handleSearchValue={handleSearchValue}
          handleSortSelect={handleSortSelect}
          handleSortDirection={handleSortDirection}
        />
      )}
      {!isListEmpty && (
        <div>
          {currentSort != SortDebt.none && (
            <div className='d-flex justify-content-end pt-3'>
              <span>
                Sorted by {direction} <strong>{currentSort}</strong>
              </span>
            </div>
          )}

          <div
            id='debt-list'
            className='row g-3 mb-4 pt-3'
          >
            {currentDebtList?.map((debt: IDebt) => {
              return (
                <div
                  className='col-12 col-md-6 col-lg-4 mr-0'
                  key={debt.id}
                >
                  <DebtCard debt={debt} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
