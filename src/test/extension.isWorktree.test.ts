/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { default as assert } from 'assert';
import * as vscode from 'vscode';
import { Repository } from '../api/api';
import { GitApiImpl } from '../api/api1';
import { isWorktree } from '../common/gitUtils';

describe('isWorktree Tests', function () {
	it('should return false for repositories with no worktrees', () => {
		const mockRepo: Repository = {
			rootUri: vscode.Uri.file('/home/user/repo1'),
			state: {
				submodules: [],
				remotes: [],
				HEAD: undefined,
				rebaseCommit: undefined,
				mergeChanges: [],
				indexChanges: [],
				workingTreeChanges: [],
				onDidChange: new vscode.EventEmitter<void>().event,
			},
		} as Partial<Repository> as Repository;

		const mockGit: GitApiImpl = {
			repositories: [mockRepo],
		} as GitApiImpl;

		const result = isWorktree(mockRepo, mockGit);
		assert.strictEqual(result, false);
	});

	it('should return true when repository is inside another repo .worktrees directory', () => {
		const worktreeRepo: Repository = {
			rootUri: vscode.Uri.file('/home/user/parent/.worktrees/feature-branch'),
			state: {
				submodules: [],
				remotes: [],
				HEAD: undefined,
				rebaseCommit: undefined,
				mergeChanges: [],
				indexChanges: [],
				workingTreeChanges: [],
				onDidChange: new vscode.EventEmitter<void>().event,
			},
		} as Partial<Repository> as Repository;

		const parentRepo: Repository = {
			rootUri: vscode.Uri.file('/home/user/parent'),
			state: {
				submodules: [],
				remotes: [],
				HEAD: undefined,
				rebaseCommit: undefined,
				mergeChanges: [],
				indexChanges: [],
				workingTreeChanges: [],
				onDidChange: new vscode.EventEmitter<void>().event,
			},
		} as Partial<Repository> as Repository;

		const mockGit: GitApiImpl = {
			repositories: [parentRepo, worktreeRepo],
		} as GitApiImpl;

		const result = isWorktree(worktreeRepo, mockGit);
		assert.strictEqual(result, true);
	});

	it('should return false when repository is not inside a .worktrees directory', () => {
		const repo1: Repository = {
			rootUri: vscode.Uri.file('/home/user/repo1'),
			state: {
				submodules: [],
				remotes: [],
				HEAD: undefined,
				rebaseCommit: undefined,
				mergeChanges: [],
				indexChanges: [],
				workingTreeChanges: [],
				onDidChange: new vscode.EventEmitter<void>().event,
			},
		} as Partial<Repository> as Repository;

		const repo2: Repository = {
			rootUri: vscode.Uri.file('/home/user/repo2'),
			state: {
				submodules: [],
				remotes: [],
				HEAD: undefined,
				rebaseCommit: undefined,
				mergeChanges: [],
				indexChanges: [],
				workingTreeChanges: [],
				onDidChange: new vscode.EventEmitter<void>().event,
			},
		} as Partial<Repository> as Repository;

		const mockGit: GitApiImpl = {
			repositories: [repo1, repo2],
		} as GitApiImpl;

		const result = isWorktree(repo1, mockGit);
		assert.strictEqual(result, false);
	});

	it('should return false when .worktrees is part of a different path segment', () => {
		const repo: Repository = {
			rootUri: vscode.Uri.file('/home/user/parent/.worktrees-other/feature'),
			state: {
				submodules: [],
				remotes: [],
				HEAD: undefined,
				rebaseCommit: undefined,
				mergeChanges: [],
				indexChanges: [],
				workingTreeChanges: [],
				onDidChange: new vscode.EventEmitter<void>().event,
			},
		} as Partial<Repository> as Repository;

		const parentRepo: Repository = {
			rootUri: vscode.Uri.file('/home/user/parent'),
			state: {
				submodules: [],
				remotes: [],
				HEAD: undefined,
				rebaseCommit: undefined,
				mergeChanges: [],
				indexChanges: [],
				workingTreeChanges: [],
				onDidChange: new vscode.EventEmitter<void>().event,
			},
		} as Partial<Repository> as Repository;

		const mockGit: GitApiImpl = {
			repositories: [parentRepo, repo],
		} as GitApiImpl;

		const result = isWorktree(repo, mockGit);
		assert.strictEqual(result, false);
	});
});
