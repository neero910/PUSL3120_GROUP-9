import test from 'node:test'
import assert from 'node:assert/strict'

import { buildApiUrl, resolveApiData } from '../src/services/api.js'


test('buildApiUrl prefixes the configured API base', () => {
  assert.equal(buildApiUrl('/guests'), '/api/guests')
})

test('resolveApiData returns mock data when the endpoint is unavailable', () => {
  const data = resolveApiData('guests', [
    { id: 1, name: 'Alice', status: 'Checked In' },
  ])

  assert.deepEqual(data, [
    { id: 1, name: 'Alice', status: 'Checked In' },
  ])
})
