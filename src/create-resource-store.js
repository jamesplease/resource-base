import createSchema from './utils/create-schema';
import getResources from './get-resources';
import updateResources from './write/update-resources';
import deleteResources from './write/delete-resources';
import createChanges from './utils/create-changes';
import { isFunction } from './utils/identification';
import { warning } from './utils/warning';

export default function createResourceStore(initialState = {}, options = {}) {
  const schemaInputs = options.schemaInputs;
  let schemas;

  for (let resourceType in schemaInputs) {
    const schema = schemaInputs[resourceType];

    schemas[resourceType] = createSchema(schema);
  }

  let currentState = initialState;

  let listeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    if (!isFunction(isFunction)) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          `You passed an invalid listener to store.subscribe.` +
            ` Listeners must be functions.`,
          'LISTENER_INVALID_TYPE'
        );
      }
    } else {
      listeners.push(listener);
    }

    let subscribed = true;

    return function unsubscribe() {
      if (!subscribed) {
        return;
      }

      subscribed = false;

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function onUpdate() {
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  return {
    getState,
    subscribe,
    getResources(resourceType, filter, options) {
      return getResources({
        schemas,
        state: currentState.resourceTypes,
        resourceType,
        filter,
        options,
      });
    },
    updateResources(path, changes) {
      const newState = updateResources({
        schemas,
        state: currentState.resourceTypes,
        changes: createChanges(path, changes),
        options,
      });

      currentState = {
        ...currentState,
        resourceTypes: {
          ...currentState.resourceTypes,
          ...newState,
        },
      };

      onUpdate();
    },
    deleteResources(path, changes) {
      const newState = deleteResources({
        schemas,
        state: currentState.resourceTypes,
        changes: createChanges(path, changes),
        options,
      });

      currentState = {
        ...currentState,
        resourceTypes: {
          ...currentState.resourceTypes,
          ...newState,
        },
      };

      onUpdate();
    },
  };
}
