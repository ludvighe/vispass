# [Vispass](https://vispass.web.app/)

_A password manager that doesn't store any passwords.\*_

## Purpose

Vispass is an attempt to a proof of concept of a [`safe`](#vulnerabilities) way to access unique passwords, without actually storing them anywhere. The passwords are accessed with _one master password_ that together with the stored data of that unique password procedurally generates the correct password for you. No verification, no decryption, nothing to [crack](https://xkcd.com/538/).

## Password Generation

With a specific password's meta data joined with your master password Vispass generates your passwords on the fly when copying them.

A password's meta data consists of a salt, the length of the password, and an iteration count.

The password data (salt, length, count) is stored but cannot by itself produce the correct password. When attempting to generate your chosen password the salt is appended to the masterpassword and passed into the SHA-3 function generating a password with a length of the specified length and iterated on itself the number of times the specified in iteration count. This results in a hash that is meant to serve as your password.

## Key store

The key store consists of all your saved passwords' meta data which are encrypted using your master password. When logging in these passwords are decrypted.

## Vulnerabilities

#### **Key store**

The key store is stored in your web browser's local storage. Hence it is possible for you to wipe your whole key store if the web site data is cleared. It is therefore recommended to always backup your key store after creating, removing and updating your passwords.

#### **Master password**

As of now it is easy to brute force your master password since there is no safeguard for this. However to do so the attacker must either have access to your computer (web browser's local storage) or your .pass file.
