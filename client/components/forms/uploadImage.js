<form onSubmit={saveImage}>
  <div className="form-group py-2 text-center">
    <small>
      <label className="text-muted py-2">Choose a Picture</label>
    </small>
    <input
      type="File"
      onChange={(e) => setImage(e.target.files[0])}
      className="form-control"
      accept=".png,.jpg,.jpeg"
    />
  </div>
  <div className="d-grid gap-5 md-3 py-3">
    <button type="submit" className="btn btn-success ">
      Upload Image
    </button>
  </div>
</form>;
