<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NoteController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $notes = auth()->user()->notes()->latest()->get();
        return Inertia::render('Dashboard', [
            'notes' => $notes,
        ]);
    }

    public function store(StoreNoteRequest $request): RedirectResponse
    {

        $validated = $request->validated();
        $note = auth()->user()->notes()->create($validated);

        return redirect()->route('dashboard')->with('success', 'Note created successfully.');
    }

    public function update(UpdateNoteRequest $request, Note $note): RedirectResponse
    {
        $this->authorize('update', $note);

        $validated = $request->validated();

        $note->update($validated);

        return redirect()->back()->with('success', 'Note updated successfully.');
    }

    public function destroy(Note $note): RedirectResponse
    {
        $this->authorize('delete', $note);

        $note->delete();

        return redirect()->route('dashboard')->with('success', 'Note deleted successfully.');
    }
}
