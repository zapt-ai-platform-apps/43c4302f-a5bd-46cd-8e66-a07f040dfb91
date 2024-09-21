import { createSignal, onMount, Show, For, createEffect } from 'solid-js';
import { supabase, createEvent } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SolidMarkdown } from 'solid-markdown';

function App() {
  const [jokes, setJokes] = createSignal([]);
  const [newJoke, setNewJoke] = createSignal({ setup: '', punchline: '' });
  const [loading, setLoading] = createSignal(false);
  const [adding, setAdding] = createSignal(false);
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [apiJoke, setApiJoke] = createSignal(null);
  const [generating, setGenerating] = createSignal(false);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(() => {
    checkUserSignedIn();
  });

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
        fetchJokes();
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.data.unsubscribe();
    };
  });

  const fetchJokes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getJokes');
      const data = await response.json();
      setJokes(data);
    } catch (error) {
      console.error('Error fetching jokes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJoke = async (event) => {
    event.preventDefault();
    setAdding(true);
    try {
      const response = await fetch('/api/createJoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJoke()),
      });
      const data = await response.json();
      setJokes([data, ...jokes()]);
      setNewJoke({ setup: '', punchline: '' });
    } catch (error) {
      console.error('Error creating joke:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleGenerateJoke = async () => {
    setGenerating(true);
    try {
      const result = await createEvent('call_api', {
        api_id: 'ea764266-2a18-41c9-b7b0-dac80fed3797',
        instructions: 'Get the current weather in London and tell a joke about it',
      });
      setApiJoke(result);
    } catch (error) {
      console.error('Error generating joke:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4 text-center">Sign in with ZAPT</h2>
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline mb-4 block text-center"
            >
              Learn more about ZAPT
            </a>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'facebook', 'apple']}
            />
          </div>
        }
      >
        <div class="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md h-full">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-4xl font-bold">Joke App</h1>
            <button
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
          <button
            class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer mb-6"
            onClick={handleGenerateJoke}
            disabled={generating()}
          >
            <Show when={!generating()} fallback="Generating...">
              Generate Joke from API
            </Show>
          </button>
          <Show when={apiJoke()}>
            <div class="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div class="text-gray-700 prose">
                <SolidMarkdown children={apiJoke()} />
              </div>
            </div>
          </Show>
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
          <Show
            when={!loading()}
            fallback={
              <p class="text-center">Loading jokes...</p>
            }
          >
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
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;