import remove from '../../src/remove';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('remove', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      author: defaultSchema,
    };

    this.state = {
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    };
  });

  it('should not change the state when called when no resource types match', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        sandwiches: {
          resources: [1],
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should not change the state when called when no resource IDs match', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: [100],
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should not change the state when called when no list names match', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          lists: ['blah'],
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should delete a single resource (ID form) that matches, leaving the rest of the state unchanged', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: [10],
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should delete a single resource (object form) that matches, leaving the rest of the state unchanged', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: [
            {
              id: 10,
            },
          ],
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should delete a list that matches, array format', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          lists: ['new'],
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should delete a list that matches, object format, leaving behind non-null lists', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          lists: {
            new: null,
            favorites: [],
          },
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should remove resources from a list', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          lists: {
            favorites: [2],
          },
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          new: [1, 5, 10],
          favorites: [5],
        },
        resources: {
          2: {
            id: 2,
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should delete a bulk selection of things', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: [{ id: 2 }, 5],
          lists: ['new'],
        },
        authors: {
          resources: ['a'],
          lists: ['things'],
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [],
        },
        resources: {
          10: {
            id: 10,
          },
        },
      },
      authors: {
        lists: {},
        resources: {
          b: { id: 'b' },
        },
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });
});