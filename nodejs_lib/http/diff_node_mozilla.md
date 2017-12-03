return 'content-type'; // ある
return 'content-length'; // ある
return 'user-agent'; // ある
return 'referer'; // ある
return 'host';  // ある
return 'authorization'; // ある
return 'proxy-authorization'; // ある
return 'if-modified-since'; // ある
return 'if-unmodified-since'; // ある
return 'from'; // ある
return 'location'; // ある
return 'max-forwards'; // ある

---- 以下はない ----
return 'retry-after';
return 'etag';
return 'last-modified';
return 'server';
return 'age';
return 'expires';
return '\u0001';
return '\u0002cookie';
return '\u0000transfer-encoding';
return '\u0000date';
return '\u0000connection';
return '\u0000cache-control';
return '\u0000vary';
return '\u0000content-encoding';
return '\u0000origin';
return '\u0000upgrade';
return '\u0000expect';
return '\u0000if-match';
return '\u0000if-none-match';
return '\u0000accept';
return '\u0000accept-encoding';
return '\u0000accept-language';
return '\u0000x-forwarded-for';
return '\u0000x-forwarded-host';
return '\u0000x-forwarded-proto';
return '\u0000' + field;

