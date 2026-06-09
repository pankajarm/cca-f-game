#!/usr/bin/env python3
"""Tiny static server for local play: python3 scripts/serve.py [port]"""
import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173

handler = partial(SimpleHTTPRequestHandler, directory=ROOT)
print(f"Architect's Ascent → http://localhost:{PORT}")
ThreadingHTTPServer(("127.0.0.1", PORT), handler).serve_forever()
