# GroupVine Custom Build


## Initial Fork & Build

For custom build instructions, see [here](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/custom-builds.html).

Then work on ./packages/ckeditor5-build-classic

At least node.js version 12 is needed, so:

```
nvm install 14.15.0
nvm use
```

(.nvmrc has been added for this version)

Also, yarn is needed here, so after switching to node 14.15.0:

```
npm install -g yarn
source ~/.bashrc
```

Then can proceed with [build instructions](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/custom-builds.html)


# TODO -- Below


Also, for some CSS tweaks (to save an external editor-styles.css
file), see the "Extracting CSS" section here:

https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html

## Bringing Up-to-date

For bringing up to date with latest master, see:

https://philna.sh/blog/2018/08/21/git-commands-to-keep-a-fork-up-to-date/
https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork

(See note below when upstream repo was changed.)

Commit and push any local changes, then:

```
git fetch upstream
git checkout master
git merge upstream/master
git status
```

Manually edit to resolve conflicts (editing not really needed in build area), then for each of these files:

```
git add <filename>
```

Then reinstall & build

```
rm -rf node_modules
npm install
npm run build
```

Also, check whether ckEditorContentStyling() styles need updating (in
gv-types/style.ts, and
[here](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/content-styles.html)

### Upstream repo location change

In April/May, 2020, the upstream repo was moved from

```
https://github.com/ckeditor/ckeditor5-build-classic.git
```

to:


```
https://github.com/ckeditor/ckeditor5/tree/master/packages/ckeditor5-build-classic
```

Refrencing
[this](https://help.github.com/en/github/using-git/changing-a-remotes-url),
I used the following to change this (in local .git/config):

```
git remote set-url upstream https://github.com/ckeditor/ckeditor5/tree/master/packages/ckeditor5-build-classic
```

