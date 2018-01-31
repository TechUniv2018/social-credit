#!/bin/sh
psql -U customer --dbname=awesomesocialcredit < init-database.sql
