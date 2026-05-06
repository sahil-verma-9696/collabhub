export class ActiveUsersManager {
  constructor() {
    /**
     * Structure:
     * {
     *   resourceId: {
     *     userId: Set(socketIds)
     *   }
     * }
     */
    this.store = {};
  }

  /**
   * CREATE
   * Add socket to user inside resource
   */
  add(resourceId, userId, socketId) {
    if (!this.store[resourceId]) {
      this.store[resourceId] = {};
    }

    if (!this.store[resourceId][userId]) {
      this.store[resourceId][userId] = new Set();
    }

    this.store[resourceId][userId].add(socketId);

    return this.store[resourceId][userId];
  }

  /**
   * READ
   * Get complete resource users
   */
  getResource(resourceId) {
    return this.store[resourceId] || {};
  }

  /**
   * READ
   * Get sockets of specific user
   */
  getUserSockets(resourceId, userId) {
    return this.store?.[resourceId]?.[userId] || new Set();
  }

  /**
   * READ
   * Check if user exists in resource
   */
  hasUser(resourceId, userId) {
    return !!this.store?.[resourceId]?.[userId];
  }

  /**
   * UPDATE
   * Replace all sockets of a user
   */
  updateUserSockets(resourceId, userId, socketIds = []) {
    if (!this.store[resourceId]) {
      this.store[resourceId] = {};
    }

    this.store[resourceId][userId] = new Set(socketIds);

    return this.store[resourceId][userId];
  }

  /**
   * DELETE
   * Remove single socket from user
   */
  removeSocket(resourceId, userId, socketId) {
    const userSockets = this.store?.[resourceId]?.[userId];

    if (!userSockets) return false;

    userSockets.delete(socketId);

    // remove user if no sockets left
    if (userSockets.size === 0) {
      delete this.store[resourceId][userId];
    }

    // remove resource if empty
    if (
      this.store[resourceId] &&
      Object.keys(this.store[resourceId]).length === 0
    ) {
      delete this.store[resourceId];
    }

    return true;
  }

  /**
   * DELETE
   * Remove complete user
   */
  removeUser(resourceId, userId) {
    if (!this.store?.[resourceId]?.[userId]) return false;

    delete this.store[resourceId][userId];

    // cleanup empty resource
    if (Object.keys(this.store[resourceId]).length === 0) {
      delete this.store[resourceId];
    }

    return true;
  }

  /**
   * DELETE
   * Remove complete resource
   */
  removeResource(resourceId) {
    if (!this.store[resourceId]) return false;

    delete this.store[resourceId];

    return true;
  }

  /**
   * DELETE
   * Remove socket globally using socketId
   *
   * Useful on socket disconnect because
   * usually only socket.id is available.
   */
  removeBySocketId(socketId) {
    for (const resourceId in this.store) {
      const users = this.store[resourceId];

      for (const userId in users) {
        const sockets = users[userId];

        // remove socket
        if (sockets.has(socketId)) {
          sockets.delete(socketId);

          // remove user if no sockets left
          if (sockets.size === 0) {
            delete users[userId];
          }

          // remove resource if empty
          if (Object.keys(users).length === 0) {
            delete this.store[resourceId];
          }

          return {
            removed: true,
            resourceId,
            userId,
            socketId,
          };
        }
      }
    }

    return {
      removed: false,
      socketId,
    };
  }

  /**
   * Get full raw store
   */
  getAll() {
    return this.store;
  }

  /**
   * Clear everything
   */
  clear() {
    this.store = {};
  }

  toString() {
    return JSON.stringify(
      this.store,
      (key, value) => {
        if (value instanceof Set) {
          return [...value];
        }
        return value;
      },
      2,
    );
  }
}
