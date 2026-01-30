
interface File {
	name: string;
	type: 'file';
	// basename: string; // Not strictly needed for storage if name is enough?
	contents: string;
}

export interface ProjectState {
	name: string;
	files: File[];
	tailwind?: boolean;
	// aliases?: Record<string, string>; // Add if needed
}

const STORAGE_ROOT = 'svelte-ide'; // Optional sub-folder to keep root clean

async function get_project_dir() {
	const root = await navigator.storage.getDirectory();
	// For now we just use a single directory for the "current" project state
	// or we can use a fixed name like 'current-workspace'
	return await root.getDirectoryHandle('current-workspace', { create: true });
}

export async function save_project(state: ProjectState) {
	try {
		const dir = await get_project_dir();
		
		// Save metadata (name, settings)
		const meta_handle = await dir.getFileHandle('project.json', { create: true });
		const meta_writable = await meta_handle.createWritable();
		await meta_writable.write({
			type: 'write',
			data: JSON.stringify({
				name: state.name,
				tailwind: state.tailwind
			})
		});
		await meta_writable.close();

		// Save files
		// We might want to clear existing files first if we support deleting files?
        // For simplicity, we just overwrite for now. Ideally we should sync.
		const files_dir = await dir.getDirectoryHandle('files', { create: true });
        
        // Naive approach: write all files.
		for (const file of state.files) {
			const file_handle = await files_dir.getFileHandle(file.name, { create: true });
			const writable = await file_handle.createWritable();
			await writable.write({ type: 'write', data: file.contents });
			await writable.close();
		}
	} catch (e) {
		console.error('Failed to save project to OPFS', e);
	}
}

export async function load_project(): Promise<ProjectState | null> {
	try {
		const dir = await get_project_dir();
		
        // Load metadata
		let meta: any = {};
		try {
			const meta_handle = await dir.getFileHandle('project.json');
			const meta_file = await meta_handle.getFile();
			const meta_text = await meta_file.text();
			meta = JSON.parse(meta_text);
		} catch (e) {
            // metadata might not exist yet
			return null; 
		}

        // Load files
		const files: File[] = [];
		try {
			const files_dir = await dir.getDirectoryHandle('files');
			// @ts-ignore - entries is async iterator
			for await (const [name, handle] of files_dir.entries()) {
				if (handle.kind === 'file') {
					const fileFn = await handle.getFile();
					const contents = await fileFn.text();
					files.push({
						name,
						type: 'file',
						contents
					});
				}
			}
		} catch (e) {
            // files dir might not exist
		}
        
        if (files.length === 0) return null;

		return {
			name: meta.name || 'Untitled',
			files,
			tailwind: meta.tailwind
		};

	} catch (e) {
		console.error('Failed to load project from OPFS', e);
		return null;
	}
}
