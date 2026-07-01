# Glory bundle deployment

`push-to-glory.sh` publishes the contents of a git bundle (`glory.bundle`) to the
Glory GitHub repository. Use it to move an offline/transferred repo snapshot up to
GitHub without needing the original working tree.

## Usage

Put `glory.bundle` and `push-to-glory.sh` in the same folder, then:

```bash
chmod +x push-to-glory.sh
./push-to-glory.sh                 # defaults to https://github.com/Lasgidi-ux/Glory.git
# or pass an explicit remote (e.g. SSH):
./push-to-glory.sh git@github.com:Lasgidi-ux/Glory.git
```

## What it does

1. Verifies `glory.bundle` is a valid git bundle.
2. Clones it into a temporary mirror (no repo required in the current folder).
3. Lists the branches and tags found in the bundle.
4. Pushes all branches and tags to the target remote.

The temporary workspace is cleaned up automatically on exit.

## Options

| Variable / arg      | Default                                   | Purpose                                  |
| ------------------- | ----------------------------------------- | ---------------------------------------- |
| `$1` (remote URL)   | `https://github.com/Lasgidi-ux/Glory.git` | Target repository to push to.            |
| `BUNDLE`            | `<script dir>/glory.bundle`               | Path to the bundle file.                 |
| `FORCE=1`           | off                                       | Force-push refs (overwrites remote history). |

Example:

```bash
BUNDLE=/path/to/glory.bundle FORCE=1 ./push-to-glory.sh git@github.com:Lasgidi-ux/Glory.git
```
