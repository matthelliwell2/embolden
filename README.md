# Embolden

This is an experiment with generating files to embroidery machines because commerial software is either very expensive, has a second rate UI or both.

Don't expect this to be complete and working, I'm just writing it in my spare time because I enjoy it.

Archtecture:
Component handle gui interactions and are generally dum
Services hold most of the logic
A component can call a serice directly
A service can call another service directly
Services cannot call components and components cannot call other components. But they can generate events to which components and services can listen.

