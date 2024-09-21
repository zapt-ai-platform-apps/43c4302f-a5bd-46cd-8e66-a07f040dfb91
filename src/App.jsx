import { createSignal, onMount, Show, For } from 'solid-js'

function App() {
  const [jokes, setJokes] = createSignal([])
  const [newJoke, setNewJoke] = createSignal({ setup: '', punchline: '' })
  const [loading, setLoading] = createSignal(false)
  const [adding, setAdding] = createSignal(false)

  const fetchJokes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/getJokes')
      const data = await response.json()
      setJokes(data)
    } catch (error) {
      console.error('Error fetching jokes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJoke = async (event) => {
    event.preventDefault()
    setAdding(true)
    try {
      const response = await fetch('/api/createJoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJoke()),
      })
      const data = await response.json()
      setJokes([data, ...jokes()])
      setNewJoke({ setup: '', punchline: '' })
    } catch (error) {
      console.error('Error creating joke:', error)
    } finally {
      setAdding(false)
    }
  }

  onMount(() => {
    fetchJokes()
  })

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div class="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md h-full">
        <h1 class="text-4xl font-bold mb-6 text-center">Joke App</h1>
        <form onSubmit={handleCreateJoke} class="mb-6">
          <input
            type="text"
            placeholder="Setup"
            value={newJoke().setup}
            onInput={(e) => setNewJoke({ ...newJoke(), setup: e.target.value })}
            class="w-full p-2 mb-2 border rounded box-border"
          />
          <input
            type="text"
            placeholder="Punchline"
            value={newJoke().punchline}
            onInput={(e) => setNewJoke({ ...newJoke(), punchline: e.target.value })}
            class="w-full p-2 mb-2 border rounded box-border"
          />
          <button
            type="submit"
            class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            disabled={adding()}
          >
            <Show when={!adding()} fallback="Adding...">
              Add Joke
            </Show>
          </button>
        </form>
        <Show when={loading()} fallback={
          <div>
            <h2 class="text-2xl font-bold mb-4">Jokes</h2>
            <For each={jokes()}>
              {(joke) => (
                <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="font-semibold">{joke.setup}</p>
                  <p class="text-gray-600">{joke.punchline}</p>
                </div>
              )}
            </For>
          </div>
        }>
          <p>Loading jokes...</p>
        </Show>
      </div>
    </div>
  )
}

export default App