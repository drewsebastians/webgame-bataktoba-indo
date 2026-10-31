"""Public-repository corpus ingestion is disabled."""
import sys
print("Blocked: corpus data administration is restricted to the private Data Engine.", file=sys.stderr)
raise SystemExit(2)
