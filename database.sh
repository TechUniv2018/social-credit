#!/bin/sh
psql -U customer --dbname=SocialCredit < init-database.sql
