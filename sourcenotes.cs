		internal SQLiteCommand (SQLiteConnection conn)
		{
			_conn = conn;
			_bindings = new List<Binding> ();
			CommandText = "";
		}
	protected virtual SQLiteCommand NewCommand ()
		{
			return new SQLiteCommand (this);
		}


				/// Creates a SQLiteCommand given the command text (SQL) with arguments. Place a '?'
		/// in the command text for each of the arguments and then executes that command.
		/// Use this method instead of Query when you don't expect rows back. Such cases include
		/// INSERTs, UPDATEs, and DELETEs.
    
// TimeExecution is boolean

    public int Execute (string query, params object[] args)
		{
			var cmd = CreateCommand (query, args);
			
			if (TimeExecution) {
				if (_sw == null) {
					_sw = new Stopwatch ();
				}
				_sw.Reset ();
				_sw.Start ();
			}

			var r = cmd.ExecuteNonQuery ();
			
			if (TimeExecution) {
				_sw.Stop ();
				_elapsedMilliseconds += _sw.ElapsedMilliseconds;
				Debug.WriteLine (string.Format ("Finished in {0} ms ({1:0.0} s total)", _sw.ElapsedMilliseconds, _elapsedMilliseconds / 1000.0));
			}
			
			return r;
		}

		/// Creates a new SQLiteCommand given the command text with arguments. Place a '?'
		/// in the command text for each of the arguments.

    		public SQLiteCommand CreateCommand (string cmdText, params object[] ps)
		{
			if (!_open)
				throw SQLiteException.New (SQLite3.Result.Error, "Cannot create commands from unopened database");

			var cmd = NewCommand ();
			cmd.CommandText = cmdText;
			foreach (var o in ps) {
				cmd.Bind (o);
			}
			return cmd;
		}

	public static extern Result Step (IntPtr stmt);

		public int ExecuteNonQuery ()
		{
			if (_conn.Trace) {
				Debug.WriteLine ("Executing: " + this);
			}
			
// result.done = SQLite result 101

			var r = SQLite3.Result.OK;
			var stmt = Prepare ();
			r = SQLite3.Step (stmt);
			Finalize (stmt);
			if (r == SQLite3.Result.Done) {
				int rowsAffected = SQLite3.Changes (_conn.Handle);
				return rowsAffected;
			} else if (r == SQLite3.Result.Error) {
				string msg = SQLite3.GetErrmsg (_conn.Handle);
				throw SQLiteException.New (r, msg);
			}
			else if (r == SQLite3.Result.Constraint) {
				if (SQLite3.ExtendedErrCode (_conn.Handle) == SQLite3.ExtendedResult.ConstraintNotNull) {
					throw NotNullConstraintViolationException.New (r, SQLite3.GetErrmsg (_conn.Handle));
				}
			}

			throw SQLiteException.New(r, r.ToString());
		}

    		protected virtual Sqlite3Statement Prepare ()
		{
			var stmt = SQLite3.Prepare2 (Connection.Handle, CommandText);
			return stmt;
		}

// Appears to return the prepared statement
		public static IntPtr Prepare2 (IntPtr db, string query)
		{
			IntPtr stmt;
#if NETFX_CORE
            byte[] queryBytes = System.Text.UTF8Encoding.UTF8.GetBytes (query);
            var r = Prepare2 (db, queryBytes, queryBytes.Length, out stmt, IntPtr.Zero);
#else
            var r = Prepare2 (db, query, System.Text.UTF8Encoding.UTF8.GetByteCount (query), out stmt, IntPtr.Zero);
#endif
			if (r != Result.OK) {
				throw SQLiteException.New (r, GetErrmsg (db));
			}
			return stmt;
		}